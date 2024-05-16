CREATE MIGRATION m14lhfyq5klpda5rapd33rkcuykhmymserfbsj3vhk6r7oic2v6jnq
    ONTO m14ojeoz2wfqr3uycrkznn3jsjzhv2o452amrjswgxvvdoifqx2sfa
{
  ALTER TYPE default::Issue {
      CREATE PROPERTY seqNo := ((std::count(default::Issue) + 1));
  };
};
