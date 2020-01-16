import sharp from 'sharp';
import path from 'path';
import appRoot from 'app-root-path';
import { probabilityFunc, createDir, checkIfDir, allImagesInDir } from './utils';


export interface DefaultInterface {
   probability?: number,
   image: Buffer | string,
   output?: string
}

export interface CropInterface extends DefaultInterface{
   width: number,
   height: number
}

export interface RotationInterface extends DefaultInterface {
   rotationDegree: number,
}

export interface PaddingInterface extends DefaultInterface {
   padding: "left" | "right" | "top" | "bottom",
   amount: number,
   background: { r: number, g: number, b: number },
}

export interface MultipleInterface {
   execute: () => Promise<void>,
   outputNumber: number,
   output?: string
}


export class ImageAugmentation {

   static __utils = () => {
      let __ctr = 1;
      let incCtr = () =>{ __ctr++; } 
      let decCtr = () =>{ __ctr--; } 
      let getCtr = () =>{ return __ctr; } 
      let __amount = Infinity;
      let setAmount = (a: number) =>{ __amount = a; } 
      let getAmount = () =>{ return __amount; } 
      return {
         incCtr, getCtr, decCtr, setAmount, getAmount
      }
   }

   private static templateFunc = async (func: (image: string | Buffer, imagename: string) => any, probability: number, image: Buffer | string, output: string) => {
      try {
         if (probability > 1)
            throw Error("Probability cannot be greater than 1.");
         else if (probability < 0)
            throw Error("Probability cannot be less than 0.");
         if (ImageAugmentation.__utils().getAmount() < ImageAugmentation.__utils().getCtr()){
            ImageAugmentation.__utils().decCtr();
            return;
         }
         createDir(output);
         let isDir: boolean;
         if (typeof image === 'string') {
            isDir = await checkIfDir(image as string);
         }
         else
            isDir = false
         if (!isDir) {
            if (probabilityFunc(probability)) {
               let imagename = ImageAugmentation.__utils().getCtr().toString() + '.jpg';
               ImageAugmentation.__utils().incCtr();
               await func(image, imagename);
            }
         }
         else {
            let files = await allImagesInDir(image as string);
            for (let i = 0; i < files.length; i++) {
               if (ImageAugmentation.__utils().getAmount() < ImageAugmentation.__utils().getCtr())
                  return;
               if (probabilityFunc(probability)) {
                  let imagename = ImageAugmentation.__utils().getCtr().toString() + '.jpg';
                  ImageAugmentation.__utils().incCtr();
                  await func(files[i], imagename);
               }
            }
         }
      } catch (e) {
         console.log(e);
      }
   }

   /**
    * @param {number} [probability = 0.5] The probability of the function occuring.
    * @param {string | Buffer} image The path or the Buffer of the image. If the given path is a directory, all images in that directory will be augmenated.
    * @param {string} [output = "./output"] The output folder in the current directory.
    * @description Select a probability and the image or directory. The grey images will be saved to the output directory.
    */

   static makeGrey = async ({ probability = 0.5, image, output = "./output" }: DefaultInterface) => {
      try {
         await ImageAugmentation.templateFunc(async (image: string | Buffer, imagename: string) => {
            await sharp(image).removeAlpha().greyscale().toFile(path.join(appRoot.path, output, imagename));
         }, probability, image, output);
      } catch (e) {
         console.log(e);
      }
   }

   /**
    * @param {number} [probability = 0.5] The probability of the function occuring
    * @param {number} rotationDegree The degree of rotation.
    * @param {string | Buffer} image The path or the Buffer of the image. If the given path is a directory, all images in that directory will be augmenated.
    * @param {string} [output = "./output"] The output folder in the current directory.
    * @description Select a probability and the image or directory. The rotated images will be saved to the output directory.
    * @example Rotation degree 90 will rotate the image right.
    */

   static rotate = async ({ rotationDegree, probability = 0.5, image, output = "./output" }: RotationInterface) => {
      try {
         await ImageAugmentation.templateFunc(async (image: string | Buffer, imagename: string) => { await sharp(image).removeAlpha().rotate(rotationDegree).toFile(path.join(appRoot.path, output, imagename)); }, probability, image, output);
      } catch (e) {
         console.log(e);
      }
   }

   /**
    * @param {number} [probability = 0.5] The probability of the function occuring.
    * @param {number} rotationDegree The degree of rotation.
    * @param {string | Buffer} image The path or the Buffer of the image. If the given path is a directory, all images in that directory will be augmenated.
    * @param {string} [output = "./output"] The output folder in the current directory.
    * @description Select a probability and the image or directory. The rotated images will be saved to the output directory.
    * @example Rotation degree 90 will rotate the image right.
    */

   static rotateRight = async ({ rotationDegree, probability = 0.5, image, output = "./output" }: RotationInterface) => {
      try {
         await ImageAugmentation.templateFunc(async (image: string | Buffer, imagename: string) => { await sharp(image).removeAlpha().rotate(rotationDegree).toFile(path.join(appRoot.path, output, imagename)); }, probability, image, output);
      } catch (e) {
         console.log(e);
      }
   }

   /**
    * @param {number} [probability = 0.5] The probability of the function occuring.
    * @param {number} rotationDegree The degree of rotation.
    * @param {string | Buffer} image The path or the Buffer of the image. If the given path is a directory, all images in that directory will be augmenated.
    * @param {string} [output = "./output"] The output folder in the current directory.
    * @description Select a probability and the image or directory. The rotated images will be saved to the output directory.
    * @example Rotation degree 90 will rotate the image left.
    */

   static rotateLeft = async ({ rotationDegree, probability = 0.5, image, output = "./output" }: RotationInterface) => {
      try {
         await ImageAugmentation.templateFunc(async (image: string | Buffer, imagename: string) => { await sharp(image).removeAlpha().rotate(rotationDegree - 180).toFile(path.join(appRoot.path, output, imagename)); }, probability, image, output);
      } catch (e) {
         console.log(e);
      }
   }

   /**
    * @param {number} [probability = 0.5] The probability of the function occuring.
    * @param {"left" | "top" | "right" | "bottom"} padding The direction of where the padding should be applied.
    * @param {number} amount The amount of padding.
    * @param {{r: number, g: number, b: number}} background The color of the padded pixels.
    * @param {string | Buffer} image The path or the Buffer of the image. If the given path is a directory, all images in that directory will be augmenated.
    * @param {string} [output = "./output"] The output folder in the current directory.
    * @description Select a probability and the image or directory. The modified images will be saved to the output directory.
    * @example padding="top", amount=10, background={r: 255, g: 255, b: 255} will add 10 white pixels to the top of the image.
    */


   static addPadding = async ({ padding, amount, background, probability = 0.5, image, output = "./output" }: PaddingInterface) => {
      try {
         let extendobj = { bottom: 0, top: 0, left: 0, right: 0, background: { r: 0, g: 0, b: 0, alpha: 1 } } as { [key: string]: number | object };
         if (padding === "bottom" || padding === "right" || padding === "top" || padding === "left")
            extendobj[padding] = amount;
         extendobj.background = { ...background, alpha: 1 }
         await ImageAugmentation.templateFunc(async (image: string | Buffer, imagename: string) => { await sharp(image).removeAlpha().extend(extendobj).toFile(path.join(appRoot.path, output, imagename)); }, probability, image, output);
      } catch (e) {
         console.log(e);
      }
   }

   /**
    * @param {number} [probability = 0.5] The probability of the function occuring.
    * @param {string | Buffer} image The path or the Buffer of the image. If the given path is a directory, all images in that directory will be augmenated.
    * @param {string} [output = "./output"] The output folder in the current directory.
    * @description Select a probability and the image or directory. The flipped images will be saved to the output directory.
    */

   static flipX = async ({ probability = 0.5, image, output = "./output" }: DefaultInterface) => {
      try {
         await ImageAugmentation.templateFunc(async (image: string | Buffer, imagename: string) => { await sharp(image).flop().removeAlpha().toFile(path.join(appRoot.path, output, imagename)); }, probability, image, output);
      } catch (e) {
         console.log(e);
      }
   }

   /**
    * @param {number} [probability = 0.5] The probability of the function occuring.
    * @param {string | Buffer} image The path or the Buffer of the image. If the given path is a directory, all images in that directory will be augmenated.
    * @param {string} [output = "./output"] The output folder in the current directory.
    * @description Select a probability and the image or directory. The flipped images will be saved to the output directory.
    */

   static flipY = async ({ probability = 0.5, image, output = "./output" }: DefaultInterface) => {
      try {
         await ImageAugmentation.templateFunc(async (image: string | Buffer, imagename: string) => { await sharp(image).flip().removeAlpha().toFile(path.join(appRoot.path, output, imagename)); }, probability, image, output);
      } catch (e) {
         console.log(e);
      }
   }

   /**
    * @param {number} width The new width of the image.
    * @param {number} height The new height of the image.
    * @param {number} [probability = 0.5] The probability of the function occuring.
    * @param {string | Buffer} image The path or the Buffer of the image. If the given path is a directory, all images in that directory will be augmenated.
    * @param {string} [output = "./output"] The output folder in the current directory.
    * @description Select a probability and the image or directory. The resized images will be saved to the output directory.
    */

   static resize = async ({ width, height, probability = 0.5, image, output = "./output" }: CropInterface) => {
      try {
         await ImageAugmentation.templateFunc(async (image: string | Buffer, imagename: string) => { await sharp(image).resize({width, height, fit: 'fill'}).removeAlpha().toFile(path.join(appRoot.path, output, imagename)); }, probability, image, output);
      } catch (e) {
         console.log(e);
      }
   }

   /**
    * @param {async () => {}} execute The function in which the static functions of the class should be called.
    * @param {string} outputNumber The number of images desired.
    * @description Select the static functions and the amount of images desired. The functions will be executed until there is the output is equal to the amount of desired images.
    */

   static executeMultiple = async ({ execute, outputNumber }: MultipleInterface) => {
      ImageAugmentation.__utils().setAmount(outputNumber);
      while (ImageAugmentation.__utils().getCtr() <= ImageAugmentation.__utils().getAmount()) {
         await execute();
         process.stdout.write('\rGenerating: ' + ((ImageAugmentation.__utils().getCtr()-1) / ImageAugmentation.__utils().getAmount() * 100) + "%");
      }
      process.stdout.write('\n');
   }
}