import { Book, BooksRepository } from '@app/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { StringStream } from 'scramjet';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class BooksSeederService {
  protected readonly logger = new Logger(BooksSeederService.name);
  private readonly BATCH_SIZE = 150;
  private storage: Storage;

  constructor(private readonly booksRepository: BooksRepository) {
    this.storage = new Storage();
  }

  async seedBooksFromCsv(bucketName: string, fileName: string): Promise<void> {
    const file = this.storage.bucket(bucketName).file(fileName);

    return file
      .createReadStream()
      .pipe(new StringStream('utf-8'))
      .CSVParse({
        header: true,
        delimiter: ',',
      })
      .map(
        (row) =>
          new Book({
            title: row.Title,
            authors: row.authors,
            description: row.description,
            image: row.image,
            publisher: row.publisher,
            previewLink: row.previewLink,
            publishedDate: row.publishedDate,
          }),
      )
      .batch(this.BATCH_SIZE)
      .each(
        async (entriesBatch: Book[]) =>
          await this.booksRepository.createMany(entriesBatch),
      )
      .run();
  }
}
