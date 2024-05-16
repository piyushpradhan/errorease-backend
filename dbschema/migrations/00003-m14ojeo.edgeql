CREATE MIGRATION m14ojeoz2wfqr3uycrkznn3jsjzhv2o452amrjswgxvvdoifqx2sfa
    ONTO m12wqrfrf2jxtwgnqhgkehhnfmwtilxilpdwuamzdb7lodprs6yooq
{
  ALTER TYPE default::Issue {
      ALTER PROPERTY created_at {
          SET REQUIRED USING (<std::datetime>std::datetime_current());
      };
      ALTER PROPERTY updated_at {
          SET REQUIRED USING (<std::datetime>std::datetime_current());
      };
  };
};
