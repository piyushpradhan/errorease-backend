CREATE MIGRATION m12c74rgc4hggpokxtvfupgp3x4ddpvcuioq56e3kth5r32f5wujiq
    ONTO m1ccfzri33o4jr6nl5owu5qtrwl4izer6tgrg3cj4zllkwwkseib2q
{
  ALTER TYPE default::Issue {
      ALTER PROPERTY seqNo {
          SET default := (SELECT
              (std::count(default::Issue) + 1)
          );
      };
  };
};
