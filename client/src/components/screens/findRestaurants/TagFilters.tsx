import React from "react";
import _ from "lodash";
import Chip from "@mui/material/Chip";
import { Filters } from "../../../types/Group";

const tags = [
  "meat",
  "vegan",
  "good",
  "dsfsd",
  "gdfsf",
  "dfhfgfdgdf",
  "sdfgsdg",
  "fsdfdsfs",
  "dsfdsf",
];
type Props = { selectedTags: any[]; onFiltersChange: Function, filters: Filters };

function TagFilters({ selectedTags = [], onFiltersChange, filters }: Props): JSX.Element {
  const handleTagsChange = (value) => {
    onFiltersChange({
      ...filters,
      tags: value,
    });
  };

  return (
    <div className="TagFilters">
      {tags.map((tag) => (
        <div key={tag} className="TagFilters-chip">
          <Chip
            label={tag}
            onClick={() => handleTagsChange(_.xor(selectedTags, [tag]))}
            {...(selectedTags.includes(tag) ? { color: "success" } : {})}
          />
        </div>
      ))}
    </div>
  );
}

export default TagFilters;
