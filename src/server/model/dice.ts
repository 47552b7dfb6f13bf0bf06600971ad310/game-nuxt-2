import type { Mongoose } from 'mongoose'
import type { IDBDice, IDBDiceHistory, IDBDiceLuckyUser } from '~~/types'

export const DBDice = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBDice>({ 
    jar: {
      default: { type: Number, default: 0 },
      now: { type: Number, default: 0 },
    },
    percent: {
      win: { type: Number, default: 50 },
      six: { type: Number, default: 0 },
      other: { type: Number, default: 10 },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('Dice', schema, 'Dice')

  const autoCreate = async () => {
    const count = await model.count({})
    if(count == 0) return await model.create({})
  }

  autoCreate()
  return model 
}

export const DBDiceHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBDiceHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    dices: [{ type: Number }],
    my: [{ type: Number }],
    coin: {
      play: { type: Number, index: true },
      receive: { type: Number, index: true },
      jar: { type: Number, index: true },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('DiceHistory', schema, 'DiceHistory')
  return model 
}

export const DBDiceLuckyUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBDiceLuckyUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('DiceLuckyUser', schema, 'DiceLuckyUser')
  return model 
}