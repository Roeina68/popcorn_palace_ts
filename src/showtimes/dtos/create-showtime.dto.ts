import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min, Max, IsDate } from "class-validator";


export class CreateShowtimeDto {
    @ApiProperty({ description: 'The theater number in which the movie is being shown (1, 2, 3, etc.)' })
    @IsNumber()
    @Min(1)
    @Max(10)
    theater: number;

    @ApiProperty({ description: 'The start time of the showtime (in 24-hour format)' })
    @IsDate()
    startTime: Date;

    @ApiProperty({ description: 'The end time of the showtime (in 24-hour format)' })
    @IsDate()
    endTime: Date;

    @ApiProperty({ description: 'The price of the showtime (in dollars)' })
    @IsNumber()
    @Min(0)
    price: number;
}
