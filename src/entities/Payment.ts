import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Lote } from "./Lote"

export type PaymentType = "PIX" | "CREDIT" | "MERCADO_PAGO"
export type PaymentStatus = "PEDDING" | "APPROVED" | "CANCELED" | "REVERSED"
export type ProductType = "SUPPLY" | "SERVICES" | "OTHERS"

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column("varchar")
  cpf!: string

  @Column({ type: "timestamptz" })
  dateTransaction!: Date

  @Column("decimal", { precision: 10, scale: 2 })
  value!: number

  @Column({ type: "varchar" })
  typePayment!: PaymentType

  @Column({ type: "varchar" })
  status!: PaymentStatus

  @Column({ type: "varchar" })
  product!: ProductType

  @ManyToOne(() => Lote, (lote) => lote.transactions, { onDelete: "CASCADE" })
  lote!: Lote
}
