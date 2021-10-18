/* eslint-disable camelcase */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from 'app/services/api/';

export const getOne = createAsyncThunk('recado/getOne', async (id, { dispatch }) => {
	const response = await ApiService.doGet(`/recados/${id}`);
	const { recado } = await response.data;

	return { ...recado };
});

export const saveOne = createAsyncThunk('recado/saveOne', async (data, { dispatch }) => {
	const request = { ...data, id_login: 1 };

	const response = await ApiService.doPost('/recado', request);
	if (!response.error) {
		dispatch(updateResponse(response.data));
		return data;
	}

	return { ...data, message: 'Concluido', success: 'Ok' };
});

export const updateOne = createAsyncThunk('recado/updateOne', async ({ data, id }, { dispatch, getState }) => {
	const request = { ...data, id_login: 1 };

	const response = await ApiService.doPut(`/recado/${id}`, request);
	const oldState = getState().recado;

	if (!response.success) {
		dispatch(updateResponse(response.data));
		return { ...data, id, id_login: 1, loading: false };
	}

	dispatch(getOne(id));

	return { ...oldState, message: 'Concluido', success: 'Ok' };
});

export const deleteOne = createAsyncThunk('recado/deleteOne', async ({ data, id }, { dispatch, getState }) => {
	const request = { ...data };

	const response = await ApiService.doDelete(`/recado/${id}`);

	return { message: 'Concluido', success: 'Ok' };
});

const initialState = {
	message: '',
	loading: false,
	titulo: '',
	descricao: ''
};

const recadoSlice = createSlice({
	name: 'recado',
	initialState,
	reducers: {
		newData: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					id: 'new',
					titulo: '',
					descricao: '',
					loading: false,
					message: ''
				}
			})
		},
		clearState: (state, action) => initialState,
		updateState: (state, action) => {
			return { ...state, ...action.payload };
		},
		updateResponse: (state, action) => {
			state.success = action.payload.success;
			state.message = action.payload.message;
		},
		updateLoading: (state, action) => {
			state.loading = action.payload;
		}
	},
	extraReducers: {
		[getOne.fulfilled]: (state, action) => action.payload,
		[saveOne.fulfilled]: (state, action) => action.payload,
		[updateOne.fulfilled]: (state, action) => action.payload
	}
});

export const { newData, updateResponse, updateLoading } = recadoSlice.actions;

export default recadoSlice.reducer;
