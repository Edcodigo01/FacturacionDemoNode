import sharp from "sharp";
import fs from "fs";

export const resizeImg = async (
  filePath: any,
  newPath: string,
  fileName: any,
  size: number
) => {
  sharp.cache(false);
  if (!fs.existsSync(newPath)) {
    await fs.mkdirSync(newPath);
  }

  await sharp(filePath).resize(size).toFile(`${newPath}/${fileName}`);

  fs.unlink("./src/assets/preImgs/" + fileName, (e) => {
    console.log(e);
  });
};
