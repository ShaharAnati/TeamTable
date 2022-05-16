import React, { useEffect, useState } from "react";
import _ from "lodash";
import Chip from "@mui/material/Chip";
import { ListItem } from "@mui/material";

type Props = { tags: any[]; selectedTags: any[]; onChange: Function };

function TagFilters({ tags, selectedTags = [], onChange }: Props): JSX.Element {
  return (
    <div className="TagFilters">
      {tags.map((tag) => (
        <div key={tag} className="TagFilters-chip">
          <Chip
            label={tag}
            onClick={() => onChange(_.xor(selectedTags, [tag]))}
            {...(selectedTags.includes(tag) ? { color: "success" } : {})}
          />
        </div>
      ))}
    </div>
  );
}

export default TagFilters;
