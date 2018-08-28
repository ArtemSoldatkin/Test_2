import React, {Component} from 'react'
import { Form, Input, Button } from 'antd';
import { connect } from 'react-redux';

const FormItem = Form.Item;

const formItemAttributes = [
    {
        name: "userSurname",
        translate: "Фамилия"
    },
    {
        name: "userName",
        translate: "Имя"
    },
    {
        name: "userPatronymic",
        translate: "Отчество"
    },
    {
        name: "userAge",
        translate: "Возраст"
        
    },
    {
        name: "userPosition",
        translate: "Должность"
    },
    {
        name: "departmentName",
        translate: "Название подразделения"
    }
];

const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

class AddForm extends Component {
  
  componentDidMount = () => {   
    this.props.form.validateFields();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if (!err) {   
            values.key=String(this.props.store.length);
            this.props.onAddMan(values);
        }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    
    const checkFieldError = fieldName => isFieldTouched(fieldName) && getFieldError(fieldName); 
     
    const formInput = formItemAttributes.map((item, index) => {  
        let regExp = /^[A-zА-яёЁ]+[A-zА-яёЁ\s-]+$/;
        if(item.name === "userAge") regExp = /^\d{1,3}$/;
        if(item.name === "departmentName" || item.name === "userPosition") regExp = /[^\s]/;
        return(
            <FormItem
                key={index}
                validateStatus={checkFieldError(item.name) ? 'error' : ''}
                help={checkFieldError(item.name) || ''}
                label={`${item.translate}:`}                    
            >
                {getFieldDecorator(item.name, {                        
                    rules: [{ pattern:regExp, required: true, message: `Поле: "${item.translate}" заполнено не верно!` }],
                })(
                    <Input className="Content__Form__Input" placeholder={item.translate} />
                )}
            </FormItem>
        );
    });
       
    return (    
        <Form onSubmit={this.handleSubmit} className="Content__Form">        
            {formInput}
            <FormItem>
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                    className="Content__Form__Button"
                >
                    Отправить
                </Button>
            </FormItem>
        </Form>
    );
  }
};

const AddFormCreated = Form.create()(AddForm);

export default connect(
    state=>({
        store: state.mans
    }),
    dispatch=>({
        onAddMan: (name) =>{ 
            dispatch({type: "ADD_MAN", payload: name});
        }
    })
  )(AddFormCreated);