import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CalculatorService } from '../services/calculator.service';
import { ExamplesService } from '../services/examples.service';
import {
  NewtonForwardDto,
  NewtonBackwardDto,
  DifferenceTableDto,
} from '../dto/calculate.dto';

@ApiTags('Calculator')
@Controller('api')
export class CalculatorController {
  constructor(
    private readonly calculatorService: CalculatorService,
    private readonly examplesService: ExamplesService,
  ) {}

  // ── Newton Forward ──

  @Post('newton-forward')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Newton Forward Difference — First Derivative',
    description:
      'Computes the first derivative at the given target x using Newton\'s Forward Difference formula, returning the full difference table, step-by-step solution, and final result.',
  })
  @ApiResponse({ status: 200, description: 'Calculation completed successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  computeNewtonForward(@Body() dto: NewtonForwardDto) {
    return this.calculatorService.computeNewtonForward(
      dto.xValues,
      dto.yValues,
      dto.targetX,
      dto.derivativeOrder,
    );
  }

  // ── Newton Backward ──

  @Post('newton-backward')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Newton Backward Difference — First Derivative',
    description:
      'Computes the first derivative at the given target x using Newton\'s Backward Difference formula.',
  })
  @ApiResponse({ status: 200, description: 'Calculation completed successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  computeNewtonBackward(@Body() dto: NewtonBackwardDto) {
    return this.calculatorService.computeNewtonBackward(
      dto.xValues,
      dto.yValues,
      dto.targetX,
      dto.derivativeOrder,
    );
  }

  // ── Difference Table ──

  @Post('difference-table')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate Difference Table',
    description:
      'Generates a forward-difference table without computing a derivative.',
  })
  @ApiResponse({ status: 200, description: 'Difference table generated.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  computeDifferenceTable(@Body() dto: DifferenceTableDto) {
    return this.calculatorService.computeDifferenceTable(
      dto.xValues,
      dto.yValues,
    );
  }

  // ── Examples ──

  @Get('examples')
  @ApiOperation({
    summary: 'Get Worked Examples',
    description:
      'Returns a list of pre-built worked examples that can be loaded into the calculator.',
  })
  @ApiResponse({ status: 200, description: 'Examples returned.' })
  getExamples() {
    return this.examplesService.getAll();
  }

  // ── Health Check ──

  @Get('health')
  @ApiOperation({
    summary: 'Health Check',
    description: 'Returns the server status, uptime, and version.',
  })
  @ApiResponse({ status: 200, description: 'Server is healthy.' })
  healthCheck() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
