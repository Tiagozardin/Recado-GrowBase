import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import ApiService from 'app/services/api';

export const getAll = createAsyncThunk('recado/getRecado', async () => {
	const response = await ApiService.doGet('/recado');
	const data = await response;

	return data;
});

const adapter = createEntityAdapter({
	selectId: recado => recado.id
});

export const { selectAll, selectById } = adapter.getSelectors(state => state.recados);

const recadosSlice = createSlice({
	name: 'recado',
	initialState: adapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getAll.fulfilled]: adapter.setAll
	}
});

export default recadosSlice.reducer;
