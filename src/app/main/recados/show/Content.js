/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import _ from '@lodash';

import Formsy from 'formsy-react';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import { TextFieldFormsy, SelectFormsy } from '@fuse/core/formsy';
import FuseLoading from '@fuse/core/FuseLoading';
import { useDeepCompareEffect } from '@fuse/hooks';

import { showMessage } from 'app/store/fuse/messageSlice';

import objectsKeysEquals from 'app/utils/validations/objectsKeysEquals';
import ButtonDefault from 'app/fuse-layouts/shared-components/button-default/ButtonDeafault';
import { Grid, InputAdornment, MenuItem } from '@material-ui/core';

import { saveOne, newData, getOne, updateOne, updateResponse, updateLoading, deleteOne } from '../store/recadoSlice';

function Content() {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const history = useHistory();
	const recadoRedux = useSelector(({ recado }) => recado);

	const [contents, setContents] = useState([]);
	const [selectedContents, setSelectedContents] = useState([]);
	const [isFormValid, setIsFormValid] = useState(false);
	const [loading, setLoading] = useState(false);

	useDeepCompareEffect(() => {
		function updateState() {
			const { uid } = routeParams;
			if (uid === 'new') {
				dispatch(newData());
			} else {
				setLoading(true);
				dispatch(getOne(uid));
			}
		}

		updateState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (recadoRedux) {
			if (loading) {
				setLoading(recadoRedux.loading);
			}
		}
	}, [recadoRedux]);

	useEffect(() => {
		function clear() {
			const { id } = routeParams;
			setIsFormValid(false);

			if (id === 'new') {
				dispatch(newData());
				history.push('/recado/new');
			} else {
				dispatch(updateResponse({ message: '', success: false }));
			}
		}

		if (recadoRedux?.message) {
			dispatch(
				showMessage({
					message: recadoRedux?.message,
					autoHideDuration: 6000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'right'
					},
					variant: 'error'
				})
			);

			clear();
		}
		if (recadoRedux?.message) {
			dispatch(
				showMessage({
					message: recadoRedux?.message,
					autoHideDuration: 6000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'right'
					},
					variant: 'success'
				})
			);

			clear();
		}
	}, [recadoRedux.message]);

	function canBeSubmitted(modal) {
		if (modal) {
			let diff = false;

			if (modal === true) {
				diff = isFormValid;
			} else {
				diff = objectsKeysEquals(modal, recadoRedux);
			}
			const diffContents = recadoRedux?.length !== selectedContents.length;

			if ((diff || diffContents) && !isFormValid) {
				setIsFormValid(true);
			}

			if (!diff && !diffContents && isFormValid) {
				setIsFormValid(false);
			}

			if ((diff && !diffContents) || (!diff && diffContents && !isFormValid)) {
				setIsFormValid(true);
			}
		}
	}

	function handleSubmit(modal) {
		setLoading(true);
		dispatch(updateLoading(true));

		if (recadoRedux?.uid !== 'new') {
			dispatch(updateOne({ data: modal, uid: recadoRedux?.uid }));
			setTimeout(function pushHistory() {
				history.push('/recado');
			}, 3000);
		} else {
			dispatch(saveOne(modal));
			setTimeout(function pushHistory() {
				history.push('/recado');
			}, 3000);
		}
	}

	function Delete() {
		dispatch(deleteOne({ uid: recadoRedux?.uid }));
		setTimeout(function pushHistory() {
			history.push('/recado');
		}, 3000);
	}

	function handleSelect(value) {
		setSelectedContents(value);
	}
	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	if (!recadoRedux?.id && loading) {
		return <FuseLoading />;
	}

	return (
		<Grid container item xs={12}>
			<Grid item xs={12}>
				<Formsy
					onValidSubmit={handleSubmit}
					onChange={canBeSubmitted}
					onValid={enableButton}
					onInvalid={disableButton}
				>
					<TextFieldFormsy
						className="mb-16 w-full"
						label="Titulo"
						type="text"
						name="titulo"
						value={recadoRedux.titulo}
						variant="outlined"
						validations={{ minLength: 3 }}
						validationErrors={{ minLength: 'Preencha o campo com o titulo' }}
						fullWidth
						autoFocus
						required
					/>
					<TextFieldFormsy
						className="mb-16 w-full"
						label="Descrição"
						type="text"
						name="descricao"
						value={recadoRedux.descricao}
						variant="outlined"
						validations={{ minLength: 3 }}
						validationErrors={{ minLength: 'Preencha o campo com a descrição' }}
						fullWidth
						required
					/>

					<Grid container item className="flex justify-end items-end">
						<Grid item xs={7} sm={5} md={4} lg={3} xl={2}>
							<ButtonDefault
								fullWidth
								type="submit"
								title="Salvar"
								loading={loading}
								disabled={!isFormValid}
							/>
							<ButtonDefault fullWidth action={Delete} title="Excluir" />
						</Grid>
					</Grid>
				</Formsy>
			</Grid>
		</Grid>
	);
}

export default Content;
