import mongoose, { Schema, Document, Model } from "mongoose"

export interface IExpense extends Document {
  schoolId: string
  title: string
  category: string
  amount: number
  date: Date
  vendorName?: string
  paymentMethod: 'Cash' | 'Card' | 'Bank Transfer' | 'Online' | 'Cheque'
  notes?: string
  attachmentUrl?: string
  createdAt: Date
  updatedAt: Date
}

const ExpenseSchema = new Schema<IExpense>({
  schoolId: { type: String, required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Electricity', 'Maintenance', 'Stationary', 'Transport', 'Internet', 'Events', 'Furniture', 'Software', 'Other'] 
  },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true, default: Date.now },
  vendorName: { type: String },
  paymentMethod: { 
    type: String, 
    required: true, 
    enum: ['Cash', 'Card', 'Bank Transfer', 'Online', 'Cheque'] 
  },
  notes: { type: String },
  attachmentUrl: { type: String },
}, { timestamps: true })

// Add index for fast querying
ExpenseSchema.index({ schoolId: 1, date: -1 })
ExpenseSchema.index({ schoolId: 1, category: 1 })

export const ExpenseModel: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema)
