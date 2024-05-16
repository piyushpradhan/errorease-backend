CREATE MIGRATION m1ztqlr62bpdq7atod24yli2cmlooxwp4ffiy64zm2yd6ojgdwi3mq
    ONTO initial
{
  CREATE TYPE default::Issue {
      CREATE PROPERTY created_at: std::datetime;
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY is_active: std::bool;
      CREATE PROPERTY issue_map: std::str;
      CREATE PROPERTY status: std::str {
          CREATE CONSTRAINT std::one_of('Open', 'Closed');
      };
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE PROPERTY updated_at: std::datetime;
  };
  CREATE TYPE default::Label {
      CREATE REQUIRED MULTI LINK issue: default::Issue;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::Issue {
      CREATE MULTI LINK labels := (.<issue[IS default::Label]);
  };
  CREATE TYPE default::Link {
      CREATE REQUIRED LINK issue: default::Issue;
      CREATE PROPERTY note: std::str;
      CREATE REQUIRED PROPERTY url: std::str;
  };
  ALTER TYPE default::Issue {
      CREATE MULTI LINK links := (.<issue[IS default::Link]);
  };
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY displayName: std::str;
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
          CREATE CONSTRAINT std::regexp(r'[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}');
      };
      CREATE REQUIRED PROPERTY uid: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY username: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::Issue {
      CREATE REQUIRED LINK owner: default::User;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK issues := (.<owner[IS default::Issue]);
  };
  ALTER TYPE default::Label {
      CREATE REQUIRED LINK owner: default::User;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK labels := (.<owner[IS default::Label]);
  };
};
