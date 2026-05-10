import axiosInstance from '../utils/axiosInstance';
import logger from '../utils/logger';

const MODULE = 'journalService';

export const getJournals = async ({ page = 0, size = 10 } = {}) => {
  logger.debug(MODULE, 'Fetching journals', { page });
  const { data } = await axiosInstance.get('/journals', { params: { page, size } });
  logger.info(MODULE, `Fetched ${data.content?.length ?? 0} journal entries`);
  return data;
};

export const getJournalById = async (id) => {
  logger.debug(MODULE, `Fetching journal ${id}`);
  const { data } = await axiosInstance.get(`/journals/${id}`);
  return data;
};

export const createJournal = async (payload) => {
  logger.info(MODULE, 'Creating journal entry', { mood: payload.mood });
  const { data } = await axiosInstance.post('/journals', payload);
  logger.info(MODULE, 'Journal created', { id: data.id });
  return data;
};

export const updateJournal = async (id, payload) => {
  logger.info(MODULE, `Updating journal ${id}`);
  const { data } = await axiosInstance.put(`/journals/${id}`, payload);
  return data;
};

export const deleteJournal = async (id) => {
  logger.warn(MODULE, `Deleting journal ${id}`);
  await axiosInstance.delete(`/journals/${id}`);
};
