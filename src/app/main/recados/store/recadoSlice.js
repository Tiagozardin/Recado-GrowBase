/* eslint-disable camelcase */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from 'app/services/api/';

export const getOne = createAsyncThunk('recado/getOne', async (id, { dispatch }) => {
	const response = await ApiService.doGet(`/recados/${id}`);
	const { recado } = await response.data;

	return { ...recado };
});

export const saveOne = createAsyncThunk('recado/saveOne', async (data, { dispatch }) => {
	const request = { ...data };

	const response = await ApiService.doPost('/recado', request);
	if (!response) {
		dispatch(updateResponse(response.data));
		return data;
	}
	const { recado } = await response.data;

	dispatch(getOne(recado.id));

	return { ...data, message: response.message, success: response.success };
});

export const updateOne = createAsyncThunk('recado/updateOne', async ({ data, id }, { dispatch, getState }) => {
	const request = { ...data };

	const response = await ApiService.doPut(`/recados/${id}`, request);
	const oldState = getState().recado;

	if (!response) {
		dispatch(updateResponse(response.data));
		return { ...data, id, loading: false };
	}

	dispatch(getOne(id));

	return { ...oldState, message: response.message, success: response.success };
});

const initialState = {
	message: '',
	loading: false,
	title: '',
	description: ''
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
					title: '',
					description: '',
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
