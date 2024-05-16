CREATE MIGRATION m1vc7cgofoqkjvq2cbq7vf56bwxyo3jk3lhpfdk2gnhqqgeppiqnea
    ONTO m12c74rgc4hggpokxtvfupgp3x4ddpvcuioq56e3kth5r32f5wujiq
{
  ALTER TYPE default::Label {
      ALTER LINK issue {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::Link {
      ALTER LINK issue {
          ON TARGET DELETE ALLOW;
      };
  };
};
