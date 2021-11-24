const User = require("../models/User");
const { unlink, readFile } = require("fs/promises");

exports.profileImage = async (req, res) => {
  const user = req.user;
  const getUser = await User.findById(user.id);
  if (req.files === null) {
    return res.status(400).json({
      errors: {
        uploadError: "No file uploaded",
      },
    });
  }
  const file = req.files.file;
  const fileName = user.id + file.name;

  try {
    const oldName = getUser.profileImage.slice(7);
    const filePath = `${__dirname}/../public/images/${oldName}`;
    const checkFile = await readFile(filePath);

    if (checkFile) {
      await unlink(filePath);
      console.log('deleted')
    }
  } catch (error) {
    console.log(error);
  }

  file.mv(`${__dirname}/../public/images/${fileName}`, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    try {
      // if (oldName !== fileName) {
      // }

      // console.log("successfully deleted");
      await getUser.updateOne({ profileImage: `images/${fileName}` });
      return res.status(200).json("successfully uploaded");
    } catch (error) {
      res.status(500).json(error);
    }
  });
};
