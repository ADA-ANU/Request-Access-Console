import React, { useState, useMemo } from "react";
import { datafile, siblingDataset } from "../stores/data";
import { Divider, Checkbox, Tag, Typography } from "antd";
import { AuthStore } from "../stores/authStore";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { toJS } from "mobx";
const CheckboxGroup = Checkbox.Group;
const { Title, Text } = Typography;

interface sibling {
  dataset: siblingDataset;
  authStore?: AuthStore;
  isLastItem: boolean;
  checkedDataFiles?: [];
  siblingCheckAllOnChange: Function;
  submitted: boolean;
}

const SiblingDataset = ({
  dataset,
  checkedDataFiles,
  siblingCheckAllOnChange,
  submitted,
  isLastItem,
}: sibling) => {
  const [selectAllChecked, toggleSelectAll] = useState(false);
  const [indeterminate, toggleIndeterminate] = useState(false);
  console.log(dataset, submitted);

  const getAllowedToBeCheckedDatafileID = () => {
    const datafileID_allowedToBeChecked = dataset.datafiles
      .filter(
        (datafile) =>
          datafile.restricted &&
          datafile.assigneeidentifier === null &&
          datafile.authenticated_user_id === null
      )
      .map((df) => df.id);
    return datafileID_allowedToBeChecked;
  };
  const selectAllOnChange = (e: any) => {
    const checked = e.target.checked;
    console.log(e.target.checked);
    if (checked) {
      const datafileID_allowedToBeChecked = getAllowedToBeCheckedDatafileID();
      //console.log(datafileID_allowedToBeChecked);
      siblingCheckAllOnChange(dataset.id, datafileID_allowedToBeChecked);
      toggleSelectAll(true);
      toggleIndeterminate(false);
    } else {
      siblingCheckAllOnChange(dataset.id, []);
      toggleSelectAll(false);
      toggleIndeterminate(false);
    }
  };
  const selectOnChange = (checkedValues: any) => {
    //console.log(checkedValues);
    siblingCheckAllOnChange(dataset.id, checkedValues);
    if (checkedValues.length === 0) {
      toggleIndeterminate(false);
      toggleSelectAll(false);
    } else {
      const datafileID_allowedToBeChecked = getAllowedToBeCheckedDatafileID();
      if (checkedValues.length === datafileID_allowedToBeChecked.length) {
        toggleSelectAll(true);
        toggleIndeterminate(false);
      } else {
        toggleSelectAll(false);
        toggleIndeterminate(true);
      }
    }
  };

  return useMemo(
    () => (
      <>
        <div style={{ display: "flex" }}>
          <Title level={5}>
            <a href={dataset.url} target="_blank">
              {dataset.dataset_title}
            </a>
          </Title>
          <Checkbox
            style={{ marginLeft: "1vw" }}
            indeterminate={indeterminate}
            onChange={selectAllOnChange}
            checked={selectAllChecked}
            disabled={submitted}
          >
            Check all
          </Checkbox>
        </div>
        <CheckboxGroup
          //options={authStore?.dataFiles}
          value={checkedDataFiles}
          onChange={selectOnChange}
          style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}
        >
          {dataset.datafiles.map(
            (file) =>
              //console.log(file);
              //console.log(authStore?.checkedDataFiles.includes(file.id));
              //disabled={file.disabled}
              file.restricted && (
                <div
                  key={file.id}
                  style={{
                    marginTop: "2vh",
                    marginBottom: "4vh",
                    marginRight: "1vw",
                    textAlign: "left",
                  }}
                >
                  {/* <Row key={file.id} style={{ marginBottom: "5vh" }}> */}
                  <Checkbox
                    key={file.id}
                    value={file.id}
                    disabled={
                      file.assigneeidentifier !== null ||
                      file.authenticated_user_id !== null ||
                      submitted
                    }
                  >
                    <div key={file.id} style={{ marginBottom: "1vh" }}>
                      {file.label}
                    </div>
                    {file.description && (
                      <div key={file.description}>
                        Description: {file.description}
                      </div>
                    )}

                    <div>
                      {file.tags.length > 0 &&
                        file.tags.map((tag, index) => (
                          <Tag key={`${file.id}-${tag}`} color="#108ee9">
                            {tag}
                          </Tag>
                        ))}
                    </div>
                  </Checkbox>

                  {/* </Row> */}
                </div>
              )
          )}
        </CheckboxGroup>
        {!isLastItem && <Divider />}
      </>
    ),
    [checkedDataFiles, submitted]
  );
};

export default SiblingDataset;
