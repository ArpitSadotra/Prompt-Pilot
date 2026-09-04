import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    chunks: {
      type: Number,
      default: 0,
    },
    vectorIds: [{
      type: String,
    }],
  },
  { timestamps: true }
)

const Document = mongoose.model('Document', documentSchema)
export default Document