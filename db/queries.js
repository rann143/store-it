const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function getUserByUsername(username) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function createUser(username, password) {
  try {
    await prisma.user.create({
      data: {
        username: username,
        password: password,
        isMember: true,
        folders: {
          create: [],
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
}

async function createFolder(name, userId) {
  try {
    await prisma.folder.create({
      data: {
        name: name,
        user: {
          connect: {
            id: userId,
          },
        },
        files: {
          create: [],
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
}

async function getFolderByUniqueConstraint(name, userId) {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        folderUnique: {
          name: name,
          userId: userId,
        },
      },
    });
    return folder;
  } catch (err) {
    console.log(err);
  }
}

async function updateFolder(folderName, userId, updateData) {
  const updateFolder = await prisma.folder.update({
    where: {
      folderUnique: {
        name: folderName,
        userId: userId,
      },
    },
    data: updateData,
  });
  return updateFolder;
}

// This will have to be updated once files can be uploaded. Due to relation,
// all files will need to be deleted first or moved to different folder before deletion
async function deleteFolder(folderName, userId) {
  const deleteFolder = await prisma.folder.delete({
    where: {
      folderUnique: {
        name: folderName,
        userId: userId,
      },
    },
  });

  return deleteFolder;
}

async function getAllFoldersForUser(user) {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        userId: user,
      },
    });
    return folders;
  } catch (err) {
    console.log(err);
  }
}

async function createFile(name, link, size, publicId, uploadTime, folderId) {
  try {
    await prisma.file.create({
      data: {
        name: name,
        link: link,
        size: size,
        publicId,
        uploadTime: uploadTime,
        folder: {
          connect: {
            id: folderId,
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteFile(fileName, folderId) {
  const deleteFile = await prisma.file.delete({
    where: {
      fileUnique: {
        name: fileName,
        folderId: folderId,
      },
    },
  });

  return deleteFile;
}

async function getAllFilesInFolder(folderId) {
  if (!folderId) {
    throw new Error("folderId is required");
  }

  const id = Number(folderId);
  if (isNaN(id)) {
    throw new Error("folderId must be a valid number");
  }
  try {
    const files = await prisma.file.findMany({
      where: {
        folderId: id,
      },
    });
    return files;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getFileDetail(fileName, folderId) {
  const id = Number(folderId);
  const file = await prisma.file.findUnique({
    where: {
      fileUnique: {
        name: fileName,
        folderId: id,
      },
    },
    include: {
      folder: true,
    },
  });

  return file;
}

module.exports = {
  prisma,
  getUserById,
  getUserByUsername,
  createUser,
  createFolder,
  getFolderByUniqueConstraint,
  getAllFoldersForUser,
  updateFolder,
  deleteFolder,
  createFile,
  getAllFilesInFolder,
  deleteFile,
  getFileDetail,
};
