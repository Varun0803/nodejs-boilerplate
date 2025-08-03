const mongoose = require('mongoose');
const config = require('../config/config');

const auditLogSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    outgoingTimestamp: {
      type: Date,
      default: null,
    },
    duration: {
      type: String,
      default: '',
    },
    method: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
    requestData: {
      body: {
        type: mongoose.SchemaTypes.Mixed,
        default: {},
      },
      query: {
        type: mongoose.SchemaTypes.Mixed,
        default: {},
      },
      params: {
        type: mongoose.SchemaTypes.Mixed,
        default: {},
      },
      headers: {
        type: mongoose.SchemaTypes.Mixed,
        default: {},
      },
      origin: {
        type: String,
        default: '',
      },
    },
    responseData: {
      statusCode: {
        type: Number,
        default: 0,
      },
      data: {
        type: mongoose.SchemaTypes.Mixed,
        default: {},
      },
      message: {
        type: String,
        default: '',
      },
    },
    status: {
      type: String,
      default: 'unknown',
    },
    errorStack: {
      type: String,
      default: '',
    },
  },
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }
);

if (config.auditLogger.enableRotation) {
  auditLogSchema.index(
    { timestamp: 1 },
    {
      expireAfterSeconds:
        config.auditLogger.auditLogRotationDays * 24 * 60 * 60,
    }
  );
}

const AuditLog = mongoose.model('AuditLog', auditLogSchema, 'auditLogs');

// 🗑️ Remove the TTL index if rotation is disabled
async function ensureNoTTLIndex() {
  if (!config.auditLogger.enableRotation) {
    const collection = mongoose.connection.collection('auditLogs');
    const indexes = await collection.indexes();

    const ttlIndex = indexes.find(
      (i) => i.key.timestamp === 1 && i.expireAfterSeconds
    );

    if (ttlIndex) {
      console.log(`Dropping TTL index: ${ttlIndex.name}`);
      await collection.dropIndex(ttlIndex.name);
    } else {
      console.log('No TTL index to drop.');
    }
  }
}

// 🔑 Call this after connecting to MongoDB
mongoose.connection.once('open', () => {
  ensureNoTTLIndex().catch(console.error);
});

module.exports = AuditLog;
