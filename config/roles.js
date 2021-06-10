const roles = ['guest', 'user', 'admin', 'superAdmin'];

const roleRights = new Map();
roleRights.set(roles[0], ['play', 'varify', 'upload', 'getChannels', 'getAlbums', 'getEpisode']);
roleRights.set(roles[1], ['varify', 'getUsers', 'upload', 'userActions', 'getChannels', 'manageChannels', 'getAlbums', 'manageAlbums', 'getEpisode', 'manageEpisodes', 'download', 'action', 'play', 'follow']);
roleRights.set(roles[2], ['manageChannels', 'manageAdmins', 'getUsers',  'getAdmins', 'manageUsers', 'public', 'upload',      'getChannels', 'manageChannels', 'getAlbums', 'manageAlbums', 'getEpisode', 'manageEpisodes']);
roleRights.set(roles[3], ['getAdmins', 'manageAdmins', 'manageUsers',  'public', 'upload', 'getChannels', 'manageChannels', 'getAlbums', 'manageAlbums', 'getEpisode', 'manageEpisodes']);


module.exports = {
    roles,
    roleRights,
};