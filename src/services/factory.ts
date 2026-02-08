import { ContentService } from './content';
import { MockContentService } from './mock-content';
import { AwsContentService } from './aws-content';

const USE_MOCK = process.env.USE_MOCK !== 'false'; // Default to Mock (true) unless explicitly set to false

export function getContentService(): ContentService {
    if (USE_MOCK) {
        return new MockContentService();
    }
    return new AwsContentService();
}
