import S3 from 'aws-sdk/clients/s3';
import log from './logger';

const s3 = new S3({
  apiVersion: '2019-08-16',
});

export function getS3File(bucket, key) {
  return s3.getObject({
    Bucket: bucket,
    Key: key,
    ResponseContentType: 'application/json',
  }).promise().then((data) => data.Body.toString());
}

export const uploadToS3 = (bucketName, filename, filedata) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: filedata,
    };
    return s3.putObject(params).promise().then(() => 'Successfully uploaded');
  } catch (_error) {
    log.error('Error in uploadToS3', _error);
    throw _error;
  }
};

export const addPhoto = ({ albumName, img, bucket }) => new Promise((resolve, reject) => {
  try {
    const fileName = img.name;
    const imgData = img.data;
    const albumPhotosKey = `${encodeURIComponent(albumName)}/`;
    const photoKey = albumPhotosKey + fileName;
    s3.upload({
      Bucket: bucket,
      Key: photoKey,
      Body: imgData,
      ACL: 'public-read',
    }, (err, data) => {
      if (err) throw new Error(err.message);
      log.info('Successfully uploaded photo.');
      log.info('data addPhoto', data);
      resolve(data);
    });
  } catch (error) {
    log.info('Error in add photo', error);
    reject(error);
  }
});

export const uploadPhoto = async ({
  image, type, userId, bucket, imageFormat,
}) => {
  try {
    const imgName = `${type}_${Date.now()}.${imageFormat}`;
    const data = await addPhoto({
      bucket,
      albumName: userId,
      img: {
        name: `${imgName}`,
        data: Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
      },
    });
    return data;
  } catch (error) {
    log.info('Error in uploadPhoto', error);
    return error;
  }
};

export const deletePhoto = ({ photoKey }) => {
  try {
    return s3.deleteObject({ Key: photoKey, Bucket: `constapps-themes-assets-bucket-${process.env.stage}` }, (err, data) => {
      if (err) throw new Error(err.message);
      log.info('Successfully deleted photo.');
      log.info('data deletePhoto', data);
      return data;
    });
  } catch (error) {
    log.info('error in deletePhoto', error);
    return error;
  }
};
