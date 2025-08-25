import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Payment } from "./Payment"

@Entity("lotes")
export class Lote {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  codeGasStation!: string

  @Column()
  nameGasStation!: string

  // range de datas pode ser salvo como json
  @Column({ type: "jsonb" })
  period!: { start: Date; end: Date }

  @Column("decimal", { precision: 5, scale: 2 })
  tax!: number

  @OneToMany(() => Payment, (payment) => payment.lote, { cascade: true })
  transactions!: Pick<Payment, "id">[]

  @Column("decimal", { precision: 10, scale: 2 })
  grossValue!: number

  @Column("decimal", { precision: 10, scale: 2 })
  netValue!: number
}
