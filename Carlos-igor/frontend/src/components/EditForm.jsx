import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';


const EditForm = ({show, handleClose, tarefa, handleEdit}) => {

    const ref = React.useRef();

    React.useEffect(() => {
        if(tarefa){
            const form = ref;
            form.tarefa.value = tarefa.tarefa
            form.descricao.value = tarefa.descricao
        }
    }, [tarefa])

    const handleSubmit = async (event)=> {
        event.preventDefault();

        const form = ref;

        handleEdit({
            ...tarefa,
            tarefa: form.tarefa.value,
            descricao: form.descricao.value
        })

        handleClose()

    }

  return (
    <>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId='tarefaEdit'>
                    <FormLabel>Titulo</FormLabel>
                    <FormControl/>
                </Form.Group>
                <Form.Group controlId='tarefaEdit'>
                    <FormLabel>Descricao</FormLabel>
                    <FormControl/>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
        salvar Alterçoes
        </Button>
        <Button variant="primary" onClick={handleClose}>
            Save Changes
        </Button>
        </Modal.Footer>
    </Modal>
    </>
);
}

export default EditForm;


