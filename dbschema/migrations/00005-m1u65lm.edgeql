CREATE MIGRATION m1u65lmndzz6bkd6j2j2e6uhdflytbt2vixionixahmvujv5axyuxq
    ONTO m14lhfyq5klpda5rapd33rkcuykhmymserfbsj3vhk6r7oic2v6jnq
{
  ALTER TYPE default::Issue {
      ALTER PROPERTY seqNo {
          USING (SELECT
              (std::count(default::Issue) + 1)
          );
      };
  };
};
