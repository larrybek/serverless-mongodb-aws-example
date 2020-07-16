import * as vandium from 'vandium';
import uuid from 'uuid/v4';
import assert from 'assert';
import { success, failure } from '../../../libs/response-lib';
import log from '../../../libs/logger';
import { initialize } from '../../../libs/mongodb-lib';
import { convertArrayOfObjectsToCSV } from '../../../libs/utils';
import { uploadToS3 } from '../../../libs/s3-lib';

const findDocuments = (db, cl) => new Promise((resolve, reject) => {
  // Query to table db collection -> document to get all data
  try {
    const collection = db.collection(cl);
    collection.find({}).toArray((err, docs) => {
      assert.equal(err, null);
      log.info('Data length', docs.length);
      resolve(docs);
    });
  } catch (e) {
    log.info('ERROR in findDocuments', e);
    reject(e);
  }
});

const csvUpload = async (data, fileName) => {
  // Converting data to CSV content & uploading it to S3
  const csv = convertArrayOfObjectsToCSV({ data });
  await uploadToS3(process.env.S3_BUCKET, `${fileName}.csv`, csv);
  return csv;
};

const convertToHTML = (data) => {
  // Purpose of this to convert table data
  let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Data</title>' +
    '<style>table td { border: 1px; } table th { background: #bdc0bf;  border: 1px; font-weight: bold; }</style>' +
    '</head><body><table style="width: 100%; border: 1px solid #ccc">';
  const headerKeys = Object.keys(data[0]);
  // Creating Table Header based on keys
  html += '<thead><tr>';
  headerKeys.forEach((i) => {
    html += `<th>${i}</th>`;
  });
  html += '</tr></thead>';
  // Converting data to table body
  html += '<tbody>';
  data.forEach((i) => {
    html += '<tr>';
    headerKeys.forEach((h) => {
      html += `<td>${i[h]}</td>`;
    });
    html += '<tr>';
  });
  html += '</tbody>';
  // Closing table
  html += '</table></body></html>';
  return html;
};

export const handler = vandium.api().POST(async (event, context, callback) => {
  try {
    // Receiving event data
    const { dbName = 'sample_airbnb', collection = 'listingsAndReviews' } = event.body;
    // Initializing connection to MongoDB
    const db = await initialize(event, context, dbName);
    // Getting data from db
    const allData = await findDocuments(db, collection);
    // Generating name for file
    const fileName = uuid();
    // Converting to CSV & Uploading to S3
    await csvUpload(allData, fileName);
    callback(null, success({ status: 200, message: 'Success', allData }));
  } catch (error) {
    log.info('ERROR in handler', error);
    callback(null, failure({ status: error.status, message: error.message }));
  }
});
