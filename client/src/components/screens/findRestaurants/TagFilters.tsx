import React, { useEffect, useState } from "react";
import _ from "lodash";
import Chip from "@mui/material/Chip";
import { Filters } from "../../../types/Group";
import axios from "axios";

type Props = {
  selectedTags: any[];
  onFiltersChange: Function;
  filters: Filters;
};

const TagFilters: React.FC<Props> = (props: Props): JSX.Element => {
  const { selectedTags = [], onFiltersChange, filters } = props;

  const [ tags, setTags ] = useState<string[]>([]);

  useEffect(() => {
    axios.get("/tags").then((tags) => {
      setTags(tags.data);
    })
  }, [])

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
            size="small"
            onClick={() => handleTagsChange(_.xor(selectedTags, [tag]))}
            {...(selectedTags.includes(tag) ? { color: "success" } : {})}
          />
        </div>
      ))}
    </div>
  );
}

export default TagFilters;
