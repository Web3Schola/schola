#![no_std]

use sails_rs::prelude::*;

struct MyPingService(());

#[sails_rs::service]
impl MyPingService {
    pub fn new() -> Self {
        Self(())
    }

    // Service's method (command)
    pub fn do_something(&mut self) -> String {
        "Hello from MyPing!".to_string()
    }
}

pub struct MyPingProgram(());

#[sails_rs::program]
impl MyPingProgram {
    // Program's constructor
    pub fn new() -> Self {
        Self(())
    }

    // Exposed service
    pub fn my_ping(&self) -> MyPingService {
        MyPingService::new()
    }
}
