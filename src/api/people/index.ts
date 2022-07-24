import { api } from "@/api";

import { PeopleListIT } from "./runtypes";

export const fetchPeopleListApi = () =>
  api.get("/people/").then(PeopleListIT.check);
