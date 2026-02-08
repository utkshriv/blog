import { ContentService } from './content';
import { Module, Post } from '@/types';
import { dynamoDb, s3 } from '@/lib/aws-client';
import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { GetObjectCommand } from '@aws-sdk/client-s3';

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'botthef-content';
const BUCKET_NAME = process.env.S3_BUCKET || 'botthef-content-bucket';

export class AwsContentService implements ContentService {

    async getDailyLogs(): Promise<Post[]> {
        try {
            // In a real app, use a GSI for date sorting. 
            // For now, Scan and filter/sort in memory (small dataset).
            const result = await dynamoDb.send(new ScanCommand({
                TableName: TABLE_NAME,
                FilterExpression: 'begins_with(PK, :pk)',
                ExpressionAttributeValues: {
                    ':pk': 'POST#'
                }
            }));

            // Map and fetch content in parallel
            const postPromises = (result.Items || []).map(async (item: any) => {
                let content = '';
                if (item.s3_key) {
                    content = await this.getS3Content(item.s3_key);
                }
                return {
                    slug: item.PK.replace('POST#', ''),
                    title: item.title,
                    date: item.date,
                    excerpt: item.excerpt,
                    tags: item.tags || [],
                    content: content || item.content || '', // Fallback to inline content if small
                } as Post;
            });

            const resolvedPosts = await Promise.all(postPromises);
            return resolvedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } catch (error) {
            console.error('Error fetching daily logs:', error);
            return [];
        }
    }

    async getModules(): Promise<Module[]> {
        try {
            const result = await dynamoDb.send(new ScanCommand({
                TableName: TABLE_NAME,
                FilterExpression: 'begins_with(PK, :pk)',
                ExpressionAttributeValues: {
                    ':pk': 'MODULE#'
                }
            }));

            return (result.Items || []).map((item: any) => ({
                slug: item.PK.replace('MODULE#', ''),
                title: item.title,
                description: item.description,
                content: '', // Don't fetch full content for list view
                problems: item.problems || []
            }));
        } catch (error) {
            console.error('Error fetching modules:', error);
            return [];
        }
    }

    async getModuleBySlug(slug: string): Promise<Module | null> {
        try {
            const result = await dynamoDb.send(new GetCommand({
                TableName: TABLE_NAME,
                Key: {
                    PK: `MODULE#${slug}`,
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
                description: item.description,
                content: content || item.content || '',
                problems: item.problems || []
            };
        } catch (error) {
            console.error(`Error fetching module ${slug}:`, error);
            return null;
        }
    }


    async getPostBySlug(slug: string): Promise<Post | null> {
        try {
            const result = await dynamoDb.send(new GetCommand({
                TableName: TABLE_NAME,
                Key: {
                    PK: `POST#${slug}`,
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

    private async getS3Content(key: string): Promise<string> {
        if (!key) return '';
        try {
            const response = await s3.send(new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key
            }));
            // S3 Body is a stream. In Node environment (Next.js server), transformToString helps.
            return await response.Body?.transformToString() || '';
        } catch (error) {
            console.error(`Error fetching S3 content for key ${key}:`, error);
            return '';
        }
    }
}
