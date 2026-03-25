import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm'

@Entity('calculation_history')
export class CalculationHistory {
  @PrimaryColumn('varchar', { length: 21 })
  id!: string

  @Column('text')
  expression!: string

  @Column('float')
  result!: number

  @Column('varchar', { length: 100, nullable: true })
  sessionId?: string

  @CreateDateColumn({ type: 'datetime' })
  timestamp!: Date
}
