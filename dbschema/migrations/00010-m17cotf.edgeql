CREATE MIGRATION m17cotfmkl7fxataz4lpnpekooj4sfftw7x66x77srme7rh4z4u7mq
    ONTO m1p344tcimjvozbmaxgng4ejfeqkmkzvdgenk27nwnnq4aby43nynq
{
  ALTER TYPE default::Label {
      ALTER LINK issues {
          RENAME TO issue;
      };
  };
  ALTER TYPE default::Issue {
      ALTER LINK labels {
          USING (.<issue[IS default::Label]);
      };
      ALTER LINK links {
          USING (.<issue[IS default::Link]);
      };
      ALTER PROPERTY status {
          RESET default;
      };
  };
  ALTER TYPE default::User {
      ALTER LINK issues {
          USING (.<owner[IS default::Issue]);
      };
      ALTER LINK labels {
          USING (.<owner[IS default::Label]);
      };
  };
};
