CREATE MIGRATION m1ccfzri33o4jr6nl5owu5qtrwl4izer6tgrg3cj4zllkwwkseib2q
    ONTO m1u65lmndzz6bkd6j2j2e6uhdflytbt2vixionixahmvujv5axyuxq
{
  ALTER TYPE default::Issue {
      ALTER PROPERTY seqNo {
          RESET EXPRESSION;
          RESET CARDINALITY;
          SET REQUIRED;
          SET TYPE std::int64;
      };
  };
};
