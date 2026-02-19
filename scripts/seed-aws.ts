import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const region = process.env.AWS_REGION || "us-west-2";
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'botthef-content';
const BUCKET_NAME = process.env.S3_BUCKET || 'botthef-content-bucket';

const dynamoClient = new DynamoDBClient({ region });
const dynamoDb = DynamoDBDocumentClient.from(dynamoClient);
const s3 = new S3Client({ region });

async function seed() {
    console.log(`Seeding to Table: ${TABLE_NAME}, Bucket: ${BUCKET_NAME}`);

    // 1. Seed Posts
    const postsDir = path.join(process.cwd(), 'src/content/posts');
    if (fs.existsSync(postsDir)) {
        const files = fs.readdirSync(postsDir);
        for (const file of files) {
            if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;

            const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
            const { data, content: mdxContent } = matter(content);
            const slug = file.replace(/\.mdx?$/, '');
            const s3Key = `posts/${slug}.mdx`;

            // Upload to S3
            await s3.send(new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: s3Key,
                Body: mdxContent,
                ContentType: 'text/markdown'
            }));
            console.log(`Uploaded S3: ${s3Key}`);

            // Put to DynamoDB
            await dynamoDb.send(new PutCommand({
                TableName: TABLE_NAME,
                Item: {
                    PK: `POST#${slug}`,
                    SK: 'METADATA',
                    title: data.title,
                    date: data.date,
                    excerpt: data.excerpt,
                    tags: data.tags,
                    s3_key: s3Key
                }
            }));
            console.log(`Put DynamoDB: POST#${slug}`);
        }
    }

    // 2. Seed Modules (Hardcoded for now)
    const modules = [
        {
            slug: 'two-pointers',
            title: 'Two Pointers',
            description: 'Master the art of manipulating arrays with two pointers.',
            content: '# Two Pointers\n\nThis is a fundamental technique...',
            problems: [
                {
                    id: '167',
                    title: 'Two Sum II',
                    link: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
                    difficulty: 'Medium',
                    status: 'Due',
                    nextReview: new Date().toISOString()
                }
            ]
        },
        {
            slug: 'sliding-window',
            title: 'Sliding Window',
            description: 'Efficiently process subarrays and substrings.',
            content: '# Sliding Window\n\nIntroduction to fixed and variable windows...',
            problems: []
        }
    ];

    for (const mod of modules) {
        const s3Key = `modules/${mod.slug}.mdx`;

        // Upload to S3
        await s3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: mod.content,
            ContentType: 'text/markdown'
        }));
        console.log(`Uploaded S3: ${s3Key}`);

        // Put to DynamoDB
        await dynamoDb.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                PK: `MODULE#${mod.slug}`,
                SK: 'METADATA',
                title: mod.title,
                description: mod.description,
                s3_key: s3Key,
                problems: mod.problems
            }
        }));
        console.log(`Put DynamoDB: MODULE#${mod.slug}`);
    }

    console.log('Seeding complete!');
}

seed().catch(console.error);
