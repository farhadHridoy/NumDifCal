import {
  IsArray,
  IsNumber,
  ArrayMinSize,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO for Newton Forward Difference calculation.
 */
export class NewtonForwardDto {
  @ApiProperty({
    description: 'Array of x values (must be equally spaced)',
    example: [0, 1, 2, 3, 4],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(3, { message: 'At least 3 data points are required' })
  @IsNumber({}, { each: true, message: 'All x values must be numbers' })
  xValues: number[];

  @ApiProperty({
    description: 'Array of y = f(x) values',
    example: [1, 2, 9, 28, 65],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(3, { message: 'At least 3 data points are required' })
  @IsNumber({}, { each: true, message: 'All y values must be numbers' })
  yValues: number[];

  @ApiProperty({
    description: 'The x value at which to compute the derivative',
    example: 1.5,
  })
  @IsNumber({}, { message: 'Target x must be a number' })
  targetX: number;

  @ApiProperty({
    description: 'The order of the derivative to compute (1 or 2)',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsIn([1, 2], { message: 'Derivative order must be 1 or 2' })
  derivativeOrder?: 1 | 2;
}

/**
 * DTO for Newton Backward Difference calculation.
 */
export class NewtonBackwardDto {
  @ApiProperty({
    description: 'Array of x values (must be equally spaced)',
    example: [0, 1, 2, 3, 4],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(3, { message: 'At least 3 data points are required' })
  @IsNumber({}, { each: true, message: 'All x values must be numbers' })
  xValues: number[];

  @ApiProperty({
    description: 'Array of y = f(x) values',
    example: [1, 2, 9, 28, 65],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(3, { message: 'At least 3 data points are required' })
  @IsNumber({}, { each: true, message: 'All y values must be numbers' })
  yValues: number[];

  @ApiProperty({
    description: 'The x value at which to compute the derivative',
    example: 3.5,
  })
  @IsNumber({}, { message: 'Target x must be a number' })
  targetX: number;

  @ApiProperty({
    description: 'The order of the derivative to compute (1 or 2)',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsIn([1, 2], { message: 'Derivative order must be 1 or 2' })
  derivativeOrder?: 1 | 2;
}

/**
 * DTO for standalone Difference Table generation.
 */
export class DifferenceTableDto {
  @ApiProperty({
    description: 'Array of x values (must be equally spaced)',
    example: [0, 1, 2, 3, 4],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'At least 2 data points are required' })
  @IsNumber({}, { each: true, message: 'All x values must be numbers' })
  xValues: number[];

  @ApiProperty({
    description: 'Array of y = f(x) values',
    example: [1, 2, 9, 28, 65],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'At least 2 data points are required' })
  @IsNumber({}, { each: true, message: 'All y values must be numbers' })
  yValues: number[];
}
