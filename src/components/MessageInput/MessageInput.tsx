import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import styles from "./MessageInput.module.scss";
import { KeyboardReturn, Search } from "@mui/icons-material";

interface MessageInputProps {
  onSubmit: (queryString: string) => void;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = (
  props: MessageInputProps
) => {
  const [queryText, setQueryText] = useState<string>("");

  const inputProps = {
    startAdornment: (
      <InputAdornment position="start">
        <Search />
      </InputAdornment>
    ),
    endAdornment: queryText.length > 0 && (
      <InputAdornment position="end">
        <KeyboardReturn />
      </InputAdornment>
    ),
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryText(e.target.value);
  };

  return (
    <>
      <TextField
        id="outlined-advanced"
        value={queryText}
        onChange={onChange}
        fullWidth
        autoComplete="off"
        multiline
        label="Type your query"
        variant="outlined"
        maxRows={2}
        InputProps={inputProps}
        className={styles.searchInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            props.onSubmit(queryText);
            setQueryText("");
          }
        }}
      />
    </>
  );
};

export default MessageInput;
