import { ApiProperty } from '@nestjs/swagger';

export class ExtractedLinkDetails {
  @ApiProperty()
  title: string;

  @ApiProperty()
  favicon: string;

  @ApiProperty()
  description: string;
}
