import { Module } from '@nestjs/common';
import { CalculatorService } from './services/calculator.service';
import { ExamplesService } from './services/examples.service';
import { CalculatorController } from './controllers/calculator.controller';

@Module({
  controllers: [CalculatorController],
  providers: [CalculatorService, ExamplesService],
  exports: [CalculatorService, ExamplesService],
})
export class CalculatorModule {}
