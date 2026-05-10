import axiosInstance from '../utils/axiosInstance';
import logger from '../utils/logger';

const MODULE = 'blogService';

/** Get paginated public blog list. Supports search + tag filter. */
export const getBlogs = async ({ page = 0, size = 9, search = '', tag = '' } = {}) => {
  logger.debug(MODULE, 'Fetching blogs', { page, size, search, tag });
  const { data } = await axiosInstance.get('/blogs', {
    params: { page, size, search: search || undefined, tag: tag || undefined },
  });
  logger.info(MODULE, `Fetched ${data.content?.length ?? 0} blogs (page ${page})`);
  return data; // Spring Page: { content, totalPages, totalElements, number }
};

/** Get a single blog by ID. */
export const getBlogById = async (id) => {
  logger.debug(MODULE, `Fetching blog ${id}`);
  const { data } = await axiosInstance.get(`/blogs/${id}`);
  return data;
};

/** Get blogs created by the authenticated user. */
export const getMyBlogs = async ({ page = 0, size = 9 } = {}) => {
  logger.debug(MODULE, 'Fetching my blogs', { page });
  const { data } = await axiosInstance.get('/blogs/me', { params: { page, size } });
  return data;
};

export const createBlog = async (payload) => {
  logger.info(MODULE, 'Creating blog', { title: payload.title });
  const { data } = await axiosInstance.post('/blogs', payload);
  logger.info(MODULE, 'Blog created', { id: data.id });
  return data;
};

export const updateBlog = async (id, payload) => {
  logger.info(MODULE, `Updating blog ${id}`);
  const { data } = await axiosInstance.put(`/blogs/${id}`, payload);
  return data;
};

export const deleteBlog = async (id) => {
  logger.warn(MODULE, `Deleting blog ${id}`);
  await axiosInstance.delete(`/blogs/${id}`);
};

export const likeBlog = async (id) => {
  logger.debug(MODULE, `Liking blog ${id}`);
  const { data } = await axiosInstance.post(`/blogs/${id}/like`);
  return data; // { likeCount }
};

export const addComment = async (id, comment) => {
  logger.debug(MODULE, `Adding comment to blog ${id}`);
  const { data } = await axiosInstance.post(`/blogs/${id}/comments`, { content: comment });
  return data;
};

export const getTags = async () => {
  const { data } = await axiosInstance.get('/blogs/tags');
  return data; // string[]
};
