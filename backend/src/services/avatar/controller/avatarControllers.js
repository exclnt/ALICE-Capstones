import {
  deleteAvatar,
  getAvatarPublicUrl,
  uploadAvatar,
} from '../services/storage-services.js';

import AvatarRepositories from '../repositories/AvatarRepositories.js';

export async function updateAvatarController(req, res) {
  try {
    const id = req.user.id;

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: 'Avatar required',
      });
    }

    const user = await AvatarRepositories.findUserAvatarById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (user.avatar) {
      await deleteAvatar(user.avatar);
    }

    const avatarPath = await uploadAvatar(file);

    const updatedUser = await AvatarRepositories.updateUserAvatar(
      id,
      avatarPath,
    );

    const avatarUrl = getAvatarPublicUrl(avatarPath);

    res.json({
      status: 'success',
      data: {
        ...updatedUser,
        // eslint-disable-next-line
        avatar_url: avatarUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getUserController(req, res) {
  try {
    const id = req.user.id;

    console.log(id);

    const user = await AvatarRepositories.findUserById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    let avatarUrl = null;

    if (user.avatar) {
      avatarUrl = getAvatarPublicUrl(user.avatar);
    }

    res.json({
      status: 'success',
      data: {
        ...user,
        // eslint-disable-next-line
        avatar_url: avatarUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
