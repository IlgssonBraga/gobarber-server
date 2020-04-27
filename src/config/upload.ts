import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'tmp'),
        filename(req, file, callback) {
            const filehash = crypto.randomBytes(10).toString('HEX');
            const filename = `${filehash}-${file.originalname}`;

            return callback(null, filename);
        },
    }),
};