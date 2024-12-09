import { resolve as _resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const entry = './src/client.ts';
export const module = {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
    ],
};
export const resolve = {
    extensions: ['.tsx', '.ts', '.js'],
};

const __dirname = dirname(fileURLToPath(import.meta.url));

export const output = {
    filename: 'bundle.js',
    path: _resolve(__dirname, 'dist'),
};

export default {
    entry: entry,
    module: module,
    resolve: resolve,
    output: output,
    devtool: 'inline-source-map',
    mode: 'development'
}