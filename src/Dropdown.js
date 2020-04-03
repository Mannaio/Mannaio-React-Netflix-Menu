import React, { useState, useEffect } from "react";

const Dropdown = ({title, key, items=[], multiselect = false}) => {

  const useKeyPress = (targetKey) => {
    const [keyPressed, setKeyPressed] = useState(false);

    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    React.useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);

      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    });

    return keyPressed;
  };

  const [open, setOpen] = useState(true);
  const [selection, setSelection] = useState([]);
  const toggle= () => setOpen(!open);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const [cursor, setCursor] = useState(1);
  const [hovered, setHovered] = useState(undefined);

  useEffect(() => {
    if (items.length && downPress) {
      setCursor(prevState => (prevState < items.length - 1 ? prevState + 1 : prevState));
    }
  }, [downPress]);

  useEffect(() => {
    if (items.length && upPress) {
      setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);

  // Per non selezionare Lingue Audio

  useEffect(() => {
    if (items.length && upPress) {
      setCursor(prevState => (prevState === 0 ? prevState + 1 : prevState));
    }
  }, [upPress]);

  // Per non selezionare Sottotitoli scorrendo giu

  useEffect(() => {
    if (items.length && downPress) {
      setCursor(prevState => (prevState === 10 ? prevState + 1 : prevState));
    }
  }, [downPress]);

  // Per non selezionare Sottotitoli scorrendo su

  useEffect(() => {
    if (items.length && upPress) {
      setCursor(prevState => (prevState === 10 ? prevState -1 : prevState));
    }
  }, [upPress]);

  // Per mantenere il track della posizione dell'elemento hovered

  useEffect(() => {
    if (items.length && hovered) {
      setCursor(items.indexOf(hovered));
    }
  }, [hovered]);

  const handleOnClick = (item) => {
    if(!selection.some(current => current.id === item.id)) {
      if(!multiselect) {
        setSelection([item]);
      } else if (multiselect) {
        setSelection([...selection, item]);
      }
    } else {
      let selectionAfterRemoval = selection
      selectionAfterRemoval = selectionAfterRemoval.filter(
        current => current.id !== item.id
      );
      setSelection([...selectionAfterRemoval]);
    }
  }

  const isItemInSelection = (item) => {
    if (selection.find(current => current.id === item.id)) {
      return true;
    }
    return false;
  }

  const ListItem = ({ item, active = true, setSelected, setHovered, i }) => (
    <li className="dd-list__item"
        tabIndex={item.id}
        key={item.id}
        data-content={item.value}
        active={i ? cursor : undefined}
        item={item.id}

    >
      <button className={`${active ? "--active" : ""}`} type="button" onClick={() => handleOnClick(item)} onMouseEnter={() => setHovered(item)} onMouseLeave={() => setHovered(undefined)} >
        {isItemInSelection(item) && (<i className="fa fa-check selected" aria-hidden="true"></i>)}
        <span>{item.value}</span>
      </button>
    </li>
  );


  return (
    <div className="dd-wrapper">
      <div
          tabIndex={1}
          className="dd-header"
          role="button"
          onKeyPress={() => toggle(!open)}
          onClick={() => toggle(!open)}
      >
          <div className="dd-header__title">
            <p className="dd-header__title--bold">{title}</p>
          </div>
          <div className="dd-header__action">
            <p>{ open ? (<i className="fa fa-plus" aria-hidden="true"></i>) : (<i className="fa fa-minus" aria-hidden="true"></i>)}</p>
          </div>
      </div>
      { open && (
        <ul className="dd-list">
          {items.map((item, i) => (
            <ListItem
              key={item.id}
              active={i === cursor}
              item={item}
              setHovered={setHovered}
            />
          ))}
        </ul>
      )}
    </div>
  );
};


export default Dropdown;
