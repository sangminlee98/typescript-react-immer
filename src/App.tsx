import React, { useCallback, useRef, useState } from 'react';
import produce from 'immer'
import './App.css';
type Form = {name: string, username: string};
type Info = {
  id: number,
  name: string,
  username: string
}
type Data = {array: Info[], uselessValue: null}
const App = () => {
  const nextId = useRef(1);
  const [form, setForm] = useState<Form>({name: '', username: ''});
  const [data, setData] = useState<Data>({
    array: [],
    uselessValue: null,
  });

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name;
      const value = e.target.value;
      setForm(
        produce(draft => {
            name === 'name' ? draft['name'] = value : draft['username'] = value;
          }
        )
      );
    },[]
  );
  const onSubmit = useCallback(
    (e:React.MouseEvent<HTMLFormElement>) => {
      e.preventDefault();
      const info: Info = {
        id: nextId.current,
        name: form.name,
        username: form.username,
      };
      setData(
        produce(draft => {
          draft.array.push(info);
        })
      );
      setForm({
        name: '',
        username: '',
      });
      nextId.current += 1;
    },[form.name, form.username]
  );
  const onRemove = useCallback(
    (id: number) => {
      setData(
        produce(draft => {
          draft.array.splice(draft.array.findIndex(info => info.id === id),1);
        })
      );
    },[]
  )
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input 
          name='username'
          placeholder='아이디'
          value={form.username}
          onChange={onChange}
        />
        <input 
          name='name'
          placeholder='이름'
          value={form.name}
          onChange={onChange}
        />
        <button type='submit'>등록</button>
      </form>
      <div>
        <ul>
          {data.array.map(info => (
            <li key={info.id} onClick={() => onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
