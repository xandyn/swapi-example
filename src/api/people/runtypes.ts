import * as IT from "io-ts";

import { createITNetworkResponseValidator } from "@/api/d";

export const PeopleListIT = createITNetworkResponseValidator(
  IT.type({
    count: IT.number,
    next: IT.union([IT.string, IT.null]),
    previous: IT.union([IT.string, IT.null]),
    results: IT.array(IT.type({}))
  })
);
