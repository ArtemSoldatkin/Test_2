import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import {connect} from 'react-redux';

const Search = Input.Search;
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {

    state = {
      editing: false
    }
  
    componentDidMount = () =>{
      if (this.props.editable) document.addEventListener('click', this.handleClickOutside, true);   
    }
  
    componentWillUnmount = () => {
      if (this.props.editable) document.removeEventListener('click', this.handleClickOutside, true);     
    }
  
    toggleEdit = () => {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) this.input.focus();        
      });
    }
  
    handleClickOutside = e => {
      const { editing } = this.state;
      if (editing && this.cell !== e.target && !this.cell.contains(e.target)) this.save();     
    }
  
    save = () => {
      const { record, handleSave } = this.props;
      this.form.validateFields((error, values) => {
        if (error) return;    
        this.toggleEdit();
        handleSave({ ...record, ...values });
      });
    }
  
    render() {
      const { editing } = this.state;  
      const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
        ...restProps
      } = this.props;
      return (
        <td ref={node => (this.cell = node)} {...restProps}>
          {editable ? (
            <EditableContext.Consumer>
              {(form) => {
                this.form = form;
                return (
                  editing ? (
                    <FormItem style={{ margin: 0 }}>
                      {form.getFieldDecorator(dataIndex, {
                        rules: [{
                          required: true,
                          message: `${title} is required.`,
                        }],
                        initialValue: record[dataIndex],
                      })(
                        <Input
                          ref={node => (this.input = node)}
                          onPressEnter={this.save}
                        />
                      )}
                    </FormItem>
                  ) : (
                    <div
                      className="editable-cell-value-wrap"
                      style={{ paddingRight: 24 }}
                      onClick={this.toggleEdit}
                    >
                      {restProps.children}
                    </div>
                  )
                );
              }}
            </EditableContext.Consumer>
          ) : restProps.children}
        </td>
      );
    }
}

class mansTable extends Component {
   
      handleDelete = key => {
        this.props.onDelete(key)
      }
    
      handleAdd = () => {      
        const newData = {
          key: String(this.props.store.length),
          userName: "-",
          userSurname: "-",
          userPatronymic: "-",
          userAge: "-",
          userPosition: "-",
          departmentName: "-"
        };     
        this.props.onAddMan(newData);
      }
    
      handleSave = row => {
        const newData = [...this.props.storeWhithoutFilters];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.props.onEdit(newData);
      }
    
    render(){     
        
        const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
        };

        let columns = [
            {
                title:"Фамилия",
                dataIndex:"userSurname",
                key:"userSurname",
                editable: true,
                sorter: (a, b) => a.userSurname.length - b.userSurname.length               
            },
            {
                title:"Имя",
                dataIndex:"userName",
                key:"userName",
                editable: true,
                sorter: (a, b) => a.userName.length - b.userName.length
            },
            {
                title:"Отчество",
                dataIndex:"userPatronymic",
                key:"userPatronymic",
                editable: true,
                sorter: (a, b) => a.userPatronymic.length - b.userPatronymic.length
            },
            {
                title:"Возраст",
                dataIndex:"userAge",
                key:"userAge",
                editable: true,
                sorter: (a, b) => a.userAge.length - b.userAge.length
            },
            {
                title:"Должность",
                dataIndex:"userPosition",
                key:"userPosition",
                editable: true,
                sorter: (a, b) => a.userPosition.length - b.userPosition.length
            },
            {
                title:"Название подразделения",
                dataIndex:"departmentName",
                key:"departmentName",
                editable: true,
                sorter: (a, b) => a.departmentName.length - b.departmentName.length
            },
            {
                title: 'operation',
                dataIndex: 'operation',
                render: (text, record) => {
                  return (
                    this.props.store.length > 0
                      ? (
                        <Popconfirm title="Уверены что хотите удалить?" onConfirm={() => this.handleDelete(record.key)}>
                          <a href="javascript:;">Удалить</a>
                        </Popconfirm>
                      ) : null
                  );
                },
              }
        ];

        columns = columns.map((col) => {
            if (!col.editable) return col;        
            return {
              ...col,
              onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: this.handleSave,
              }),
            };
        });

        return(
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    Добавить строку
                </Button>
                <Search
                    placeholder="Введите текст для поиска"
                    onSearch={value => this.props.onFilter(value)}
                    style={{ width: 200 }}
                />
                <div>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={this.props.store}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
}

export default connect(
    state=>({    
     store:state.mans.filter(man => {
        let check = false;
        for(let i in man){
          if(i!=="key"){
            if(String(man[i]).includes(state.filter)){
              check = true;
              break;
            }
          }
        }
        return check;
     }),
     storeWhithoutFilters: state.mans     
    }),
    dispatch=>({
      onAddMan: (name) =>{ 
        dispatch({type: "ADD_MAN", payload: name});
      },
      onFilter: (text) =>{
        dispatch({type:"FILTER_MAN", payload:text});
      },
      onDelete: (key) =>{
        dispatch({type:"DELETE_MAN", payload:key});
      },
      onEdit: (data) =>{
        dispatch({type:"EDIT_MAN", payload:data});
      }  
    })
)(mansTable)
