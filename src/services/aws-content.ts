import { ContentService } from './content';
import { Module, Post, Problem } from '@/types';
import { dynamoDb, s3 } from '@/lib/aws-client';
import { ScanCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { GetObjectCommand } from '@aws-sdk/client-s3';

const BLOG_TABLE_NAME = process.env.DYNAMODB_BLOG_TABLE || 'blog';
const PLAYBOOK_TABLE_NAME = process.env.DYNAMODB_PLAYBOOK_TABLE || 'playbook';
const BUCKET_NAME = process.env.S3_BUCKET || 'botthef-content-bucket';

export class AwsContentService implements ContentService {

    async getDailyLogs(): Promise<Post[]> {
        try {
            const result = await dynamoDb.send(new ScanCommand({
                TableName: BLOG_TABLE_NAME,
                 FilterExpression: 'begins_with(PK, :pk)',
                ExpressionAttributeValues: {
                    ':pk': 'BLOG#'
                }
            }));

            const postPromises = (result.Items || []).map(async (item: any) => {
                let content = '';
                if (item.s3_key) {
                    content = await this.getS3Content(item.s3_key);
                }
                return {
                    slug: item.PK.replace('BLOG#', ''),
                    title: item.title,
                    date: item.date,
                    excerpt: item.excerpt,
                    tags: item.tags || [],
                    content: content || item.content || '',
                } as Post;
            });

            const resolvedPosts = await Promise.all(postPromises);
            return resolvedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } catch (error) {
            console.error('Error fetching daily logs:', error);
            return [];
        }
    }

    async getPostBySlug(slug: string): Promise<Post | null> {
        try {
            const result = await dynamoDb.send(new GetCommand({
                TableName: BLOG_TABLE_NAME,
                Key: {
                    PK: `BLOG#${slug}`,
                    SK: 'METADATA'
                }
            }));

            if (!result.Item) return null;

            const item = result.Item;
            let content = '';
            if (item.s3_key) {
                content = await this.getS3Content(item.s3_key);
            }

            return {
                slug,
                title: item.title,
                date: item.date,
                excerpt: item.excerpt,
                tags: item.tags || [],
                content: content || item.content || '',
            } as Post;
        } catch (error) {
            console.error(`Error fetching post ${slug}:`, error);
            return null;
        }
    }

    async getModules(): Promise<Module[]> {
        try {
            // Use the GSI to fetch all playbook items (metadata and problems) in one query.
            const result = await dynamoDb.send(new QueryCommand({
                TableName: PLAYBOOK_TABLE_NAME,
                IndexName: 'playbook-collection-gsi',
                KeyConditionExpression: 'collection = :collection',
                ExpressionAttributeValues: {
                    ':collection': 'PLAYBOOK'
                }
            }));

            if (!result.Items) {
                return [];
            }

            // Process the flat list of items into a nested structure.
            const modulesMap = new Map<string, Module>();

            // First, create all the module entries
            for (const item of result.Items) {
                if (item.SK === 'METADATA') {
                    const slug = item.PK.replace('PLAYBOOK#', '');
                    modulesMap.set(slug, {
                        slug,
                        title: item.title,
                        description: item.description,
                        content: '', // No full content in list view
                        problems: [], // Initialize empty problems array
                    });
                }
            }

            // Then, associate problems with their parent module
            for (const item of result.Items) {
                if (item.SK.startsWith('PROBLEM#')) {
                    const moduleSlug = item.PK.replace('PLAYBOOK#', '');
                    const parentModule = modulesMap.get(moduleSlug);

                    if (parentModule) {
                        parentModule.problems.push({
                            id: item.SK.replace('PROBLEM#', ''),
                            title: item.title,
                            link: item.leetcodeUrl,
                            difficulty: item.difficulty,
                            status: item.status
                        } as Problem);
                    }
                }
            }
            
            return Array.from(modulesMap.values());

        } catch (error) {
            console.error('Error fetching modules:', error);
            return [];
        }
    }

    async getModuleBySlug(slug: string): Promise<Module | null> {
        try {
            const result = await dynamoDb.send(new QueryCommand({
                TableName: PLAYBOOK_TABLE_NAME,
                KeyConditionExpression: 'PK = :pk',
                ExpressionAttributeValues: {
                    ':pk': `PLAYBOOK#${slug}`
                }
            }));

            if (!result.Items || result.Items.length === 0) return null;

            const metadataItem = result.Items.find(item => item.SK === 'METADATA');
            if (!metadataItem) return null;

            const problems = result.Items
                .filter(item => item.SK.startsWith('PROBLEM#'))
                .map(item => ({
                    id: item.SK.replace('PROBLEM#', ''),
                    title: item.title,
                    link: item.leetcodeUrl,
                    difficulty: item.difficulty,
                    status: item.status,
                    lastSolved: item.lastSolved,
                    nextReview: item.nextReview,
                } as Problem));

            let content = '';
            if (metadataItem.s3_key) {
                content = await this.getS3Content(metadataItem.s3_key);
            }

            return {
                slug,
                title: metadataItem.title,
                description: metadataItem.description,
                content: content || metadataItem.content || '',
                problems: problems
            };
        } catch (error) {
            console.error(`Error fetching module ${slug}:`, error);
            return null;
        }
    }

    private async getS3Content(key: string): Promise<string> {
        if (!key) return '';
        try {
            const response = await s3.send(new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key
            }));
            return await response.Body?.transformToString() || '';
        } catch (error) {
            console.error(`Error fetching S3 content for key ${key}:`, error);
            return '';
        }
    }
}
